import { Injectable, signal } from '@angular/core';
import { IFilters } from '@teq/shared/components/filters/types/filters.type';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import { APIService } from '../../states/api/api.service';
import { IPhase } from '@teq/shared/types/phase.type';
import { IRole } from '@teq/shared/types/roles.type';
import { ICategory } from '@teq/shared/types/category.type';
import { ITemplate } from '@teq/shared/types/template.type';
import { IOption } from '../select/types/option.type';
import { EntityDataType, IApproach, IMethod, ISubphase, ITask } from '@teq/shared/types/types';
import { environment } from 'environments/environment';

const MatchAllOfType = '-1';

type EntityPropStringValue = string | undefined | EntityPropStringValue[];

export enum FilterType {
    ToggleFilterDisabled = 1,
    ToggleDisableControl,
    SelectComplexity,
    SelectRoles,
    SelectCategory,
    Search
}

interface IFilterValues {
    [FilterType.SelectRoles]: IRole[];
    [FilterType.SelectComplexity]: ITemplate[];
    [FilterType.SelectCategory]: ICategory[];
}

interface IFilterCriteria {
    filter: FilterType;
    value: string | number | boolean | Array<string | number | boolean>;
    isArray: boolean;
    isBoolean: boolean;
    isNumber: boolean;
    isString: boolean;
}

const valueExtractableTypes = {
    [FilterType.SelectRoles]: true,
    [FilterType.SelectComplexity]: true,
    [FilterType.SelectCategory]: true
};

@Injectable({
    providedIn: 'root'
})
export class FiltersService {
    /**
     * Given a phases array computes the disable map associated with the provided selection
     */
    public static computeDisableMap(data: IPhase[]): Record<string, boolean> {
        const disableMap: Record<string, boolean> = {};

        data.forEach(p => {
            disableMap[p.id] = !!p.disabled;

            p.subphases?.forEach(s => {
                disableMap[`${p.id}.${s.id}`] = !!s.disabled;

                s.methods.forEach(m => {
                    disableMap[`${p.id}.${s.id}.${m.id}`] = !!m.disabled;

                    m.approaches.forEach(a => {
                        disableMap[`${p.id}.${s.id}.${m.id}.${a.id}`] = !!a.disabled;

                        a.tasks.forEach(t => {
                            disableMap[`${p.id}.${s.id}.${m.id}.${a.id}.${t.id}`] = !!t.disabled;
                        });
                    });
                });
            });
        });

        return disableMap;
    }

    private readonly _filters = new BehaviorSubject<IFilters>({ selects: [], toggles: [] });
    public term = signal('');
    public term$ = new BehaviorSubject('');
    private readonly _phases: BehaviorSubject<IPhase[]> = new BehaviorSubject<IPhase[]>([]);

    private _originalPhases!: IPhase[];

    private _filtersRegistered = false;

    private _registeredFilters!: FilterType[];

    private _disableMap: Record<string, boolean> = {};
    private readonly _collapsedMap: Record<string, boolean> = {};

    private _filteredMap: Record<string, EntityDataType> = {};

    private _defaultCriterias: IFilterCriteria[] = [];

    constructor(private readonly _apiService: APIService) {
        this._apiService.phases$.pipe(distinctUntilChanged()).subscribe(phases => {
            // Retain the list of fetched phases
            this._originalPhases = phases;

            if (this._filtersRegistered) {
                // Make sure to refilter on external phases changes
                const filters = this._filters.value;
                const formControls: Record<string, string | string[] | boolean> = {};

                filters.toggles.forEach(t => (formControls[t.controlName] = t.value ?? false));
                filters.selects.forEach(t => (formControls[t.controlName] = t.value ?? t.controlName === FilterType.Search ? '' : MatchAllOfType));

                this._defaultCriterias = this._determineFilterCriterias(formControls);

                this.filter(formControls);

                // Recreate filters
                this._addFilters();
            }
        });
    }

    public get filters$(): Observable<IFilters> {
        return this._filters.asObservable();
    }

    public get phases$(): Observable<IPhase[]> {
        return this._phases.asObservable();
    }

    public getTailoredPhases(): IPhase[] {
        return this._originalPhases.map(p => this._filterInDepth(p, this._defaultCriterias)).filter(Boolean) as IPhase[];
    }

    public mergeDisableMap(disableMap: Record<string, boolean> = {}): void {
        this._disableMap = {
            ...this._disableMap,
            ...disableMap
        };

        // Make sure to refilter on external phases changes
        const filters = this._filters.value;
        const formControls: Record<string, string | string[] | boolean> = {};

        filters.toggles.forEach(t => (formControls[t.controlName] = t.value ?? false));
        filters.selects.forEach(t => (formControls[t.controlName] = t.value ?? t.controlName === FilterType.Search ? '' : MatchAllOfType));

        this._defaultCriterias = this._determineFilterCriterias(formControls);

        this.filter(formControls);
    }

    public addFilters(...types: FilterType[]): IFilters {
        // Cache the filters for further evaluation
        this._registeredFilters = types;

        return this._addFilters();
    }

    public ensureCollapsedStatusAtLocation(entity: EntityDataType, collapsed: boolean): void {
        // Enforce the new status on the entity itself
        this.enforceCollapseStatus(entity, collapsed);
    }

    public enforceDisabledStatusAtLocation(entity: EntityDataType, disabled: boolean): void {
        // Enforce the new status on the entity itself
        this.enforceDisableStatus(entity, disabled);

        // Enforce the new status on all children
        this.enforceDisabledOnChildren(entity, disabled);

        // Enforce the new status on affected parents
        this.enforceDisabledOnParents(entity, disabled);
    }

    private enforceCollapseStatus(entity: EntityDataType, collapsed: boolean): void {
        entity.collapsed = collapsed;
        this._collapsedMap[entity._locator] = collapsed; // Cache the collapsed status change at disable Map level
    }

    private enforceDisableStatus(entity: EntityDataType, disabled: boolean): void {
        entity.disabled = disabled;
        this._disableMap[entity._locator] = disabled; // Cache the disable status change at disable Map level
    }

    private enforceDisabledOnChildren(entity: EntityDataType, disabled: boolean): void {
        if (entity.type === 'phase') {
            entity.subphases?.forEach(s => this.enforceDisabledOnChildren(s, disabled));
        } else if (entity.type === 'subphase') {
            entity.methods?.forEach(m => this.enforceDisabledOnChildren(m, disabled));
        } else if (entity.type === 'method') {
            entity.approaches?.forEach(a => this.enforceDisabledOnChildren(a, disabled));
        } else if (entity.type === 'approach' || entity.type === 'task') {
            // No task level disable status
        }

        this.enforceDisableStatus(entity, disabled);
    }

    /**
     * Given an entity attempts to fetch it's current parent inside the filtered data slice based
     * on a parent locator derived from the entity locator
     */
    private getEntityParent(entity: EntityDataType): EntityDataType | null {
        const locator = entity._locator;
        const idx = entity._locator.lastIndexOf('.');
        const parentLocator = locator.slice(0, idx > -1 ? idx : locator.length);

        if (parentLocator) {
            if (parentLocator in this._filteredMap) {
                return this._filteredMap[parentLocator];
            }
        }

        return null;
    }

    private enforceDisabledOnParents(entity: EntityDataType, disabled: boolean): void {
        if (entity.type === 'phase') {
            // No phase level parents
            return;
        }

        if (!disabled) {
            // Ensure enablement regardless of prior status
            const parent = this.getEntityParent(entity);

            if (parent) {
                this.enforceDisableStatus(parent, disabled);

                this.enforceDisabledOnParents(parent, disabled);
            }
        } else {
            // Only disable parent levels when all children of same type are disabled
            const parent = this.getEntityParent(entity);

            if (parent) {
                let children: EntityDataType[] = [];

                switch (parent.type) {
                    case 'phase':
                        children = parent.subphases ?? [];

                        break;

                    case 'subphase':
                        children = parent.methods ?? [];

                        break;

                    case 'method':
                        children = parent.approaches ?? [];

                        break;

                    default:
                        // No disalble status at task
                        break;
                }

                if (!children.some(c => !c.disabled)) {
                    // All children are disabled, disable the paret as well
                    this.enforceDisableStatus(parent, disabled);

                    // Ensure disabling further in the parent chain
                    this.enforceDisabledOnParents(parent, disabled);
                }
            }
        }
    }

    private _addFilters(): IFilters {
        const types = this._registeredFilters;

        // Aggregate value extraction needs
        const aggregations: Partial<IFilterValues> = {};

        types.forEach(t => {
            if (t in valueExtractableTypes) {
                aggregations[t as keyof IFilterValues] = [];
            }
        });

        // Extract filter values
        this._extractFilterValues(this._originalPhases, aggregations);

        // Populate filters
        const filters: IFilters = {
            selects: [],
            toggles: []
        };

        types.forEach(type => {
            switch (type) {
                case FilterType.ToggleFilterDisabled:
                    filters.toggles.push({
                        controlName: FilterType.ToggleFilterDisabled,
                        value: false,
                        label: 'Hide disabled'
                    });

                    break;

                case FilterType.ToggleDisableControl:
                    filters.toggles.push({
                        controlName: FilterType.ToggleDisableControl,
                        value: true,
                        label: 'Show disable/enable toggles'
                    });

                    break;

                case FilterType.SelectComplexity:
                    filters.selects.push({
                        controlName: FilterType.SelectComplexity,
                        options: [
                            {
                                value: MatchAllOfType,
                                label: 'All Scenarios'
                            },
                            ...(aggregations[FilterType.SelectComplexity]?.map<IOption>(c => ({
                                value: c.id,
                                label: c.name
                            })) ?? [])
                        ]
                    });

                    break;

                case FilterType.SelectRoles:
                    filters.selects.push({
                        controlName: FilterType.SelectRoles,
                        // multiple: true,
                        options: [
                            {
                                value: MatchAllOfType,
                                label: 'All Roles'
                            },
                            ...(aggregations[FilterType.SelectRoles]?.map<IOption>(r => ({
                                value: r.id,
                                label: r.name
                            })) ?? [])
                        ]
                    });

                    break;

                case FilterType.SelectCategory:
                    filters.selects.push({
                        controlName: FilterType.SelectCategory,
                        options: [
                            {
                                value: MatchAllOfType,
                                label: 'VA & QC'
                            },
                            ...(aggregations[FilterType.SelectCategory]?.map<IOption>(c => ({
                                value: c.id,
                                label: c.name
                                    .split(' ')
                                    .map(v => v.slice(0, 1))
                                    .join('')
                                    .toUpperCase()
                            })) ?? [])
                        ]
                    });

                    break;

                case FilterType.Search:
                    filters.selects.push({
                        label: 'Search...',
                        controlName: FilterType.Search,
                        searchable: true,
                        searchIcon: true,
                        options: []
                    });

                    break;

                default:
                    break;
            }
        });

        // Update the filters
        this._filters.next(filters);

        this._filtersRegistered = true;

        return filters;
    }

    filter(filters: Record<string, IFilterCriteria['value']>): void {
        this.term.update(() => filters[6] as string);
        this.term$.next(filters[6] as string);

        const filterCriterias = this._determineFilterCriterias(filters);
        const filtered = this._originalPhases.map(p => this._filterInDepth(p, filterCriterias)).filter(Boolean) as IPhase[];

        this._filteredMap = {}; // Clear filtered entity lookup map
        this._regenerateFilterMap(filtered);

        this._phases.next(filtered);
    }

    private _filterInDepth(entity: EntityDataType, criterias: IFilterCriteria[]): EntityDataType | null {
        // Filter all entities in depth while deep clonning results at the same time
        if (entity.type === 'phase') {
            // Phase level, filter subphases but ignore the phase itself (non filterable)
            return {
                ...entity,
                disabled: entity._locator in this._disableMap ? this._disableMap[entity._locator] : entity.disabled,
                subphases: entity.subphases?.map(s => this._filterInDepth(s, criterias)) as ISubphase[]
            } satisfies IPhase;
        } else if (entity.type === 'subphase') {
            // SubPhase level, filter methods but ignore the subphase itself (non filterable)
            return {
                ...entity,
                disabled: entity._locator in this._disableMap ? this._disableMap[entity._locator] : entity.disabled,
                methods: entity.methods?.map(m => this._filterInDepth(m, criterias)).filter(Boolean) as IMethod[]
            } satisfies ISubphase;
        } else if (entity.type === 'method') {
            // Method level, filter approaches and the method itself
            const approaches = entity.approaches?.map(a => this._filterInDepth(a, criterias)).filter(Boolean) as IApproach[];
            let matchAllSearch = false;
            let searchMatch = false;

            if (!approaches.length) {
                // Filter method level only if it has no approaches
                for (const criteria of criterias) {
                    if (criteria.filter === FilterType.Search) {
                        matchAllSearch = criteria.value === '';

                        if (
                            this._matchesStrings(criteria.value as string, [
                                entity.name, // Method name contains
                                entity.description // Method description contains
                            ])
                        ) {
                            searchMatch = true;
                        }
                    }
                }
            }

            // Known side effect: emptyu approaches are not displayed at all
            if ((!matchAllSearch && searchMatch && approaches.length) || approaches.length) {
                return {
                    ...entity,
                    disabled: entity._locator in this._disableMap ? this._disableMap[entity._locator] : entity.disabled,
                    collapsed: entity._locator in this._collapsedMap ? this._collapsedMap[entity._locator] : entity.collapsed,
                    approaches
                } satisfies IMethod;
            }
        } else if (entity.type === 'approach') {
            // Approach level, filter tasks and the approach itself
            const tasks = entity.tasks?.map(t => this._filterInDepth(t, criterias)).filter(Boolean) as ITask[];
            let roles: IRole[] = [];
            let templates: ITemplate[] = [];
            let maintain = false;

            let matchAllSearch = false;
            let searchMatch = false;
            let matchAllRole = false;
            let roleMatch = false;
            let matchAllTemplates = false;
            let templateMatch = false;

            // Filter approach level if it has no approaches
            for (const criteria of criterias) {
                if (criteria.filter === FilterType.Search) {
                    // TODO: Take the string length into account for match all cases determination
                    matchAllSearch = criteria.value === '';
                    if (
                        this._matchesStrings(criteria.value as string, [
                            entity.name, // Approach name contains
                            entity.description // Approach description contains
                        ])
                    ) {
                        // Search filter matched
                        searchMatch = true;
                    }
                } else if (criteria.filter === FilterType.SelectComplexity) {
                    matchAllTemplates = criteria.value.toString() === MatchAllOfType;

                    templates = entity.templates
                        .map(t => {
                            if (
                                criteria.value.toString() === MatchAllOfType || // Match all case
                                (criteria.isArray && (criteria.value as unknown[]).includes(t.id)) || // Match one of
                                (!criteria.isArray && criteria.value === t.id) // Match exact
                            ) {
                                templateMatch = true;

                                return { ...t };
                            }

                            return null;
                        })
                        .filter(Boolean) as ITemplate[];
                } else if (criteria.filter === FilterType.SelectRoles) {
                    matchAllRole = criteria.value.toString() === MatchAllOfType;

                    roles = entity.roles
                        .map(r => {
                            if (
                                criteria.value.toString() === MatchAllOfType || // Match all case
                                (criteria.isArray && (criteria.value as unknown[]).includes(r.id)) || // Match one of
                                (!criteria.isArray && criteria.value === r.id) // Match exact
                            ) {
                                roleMatch = true;

                                return { ...r };
                            }

                            return null;
                        })
                        .filter(Boolean) as IRole[];
                }
            }

            // Evaluate matches (there is no posibility of early breaking due to the need of filtering at all sublevels)
            if (
                ![matchAllSearch ? null : searchMatch, matchAllTemplates ? null : templateMatch, matchAllRole ? null : roleMatch].some(v => v === false) || // No failing condition
                tasks.length // Or child contents
            ) {
                maintain = true;
            }

            if (maintain) {
                const cloned = {
                    ...entity,
                    disabled: entity._locator in this._disableMap ? this._disableMap[entity._locator] : entity.disabled,
                    collapsed: entity._locator in this._collapsedMap ? this._collapsedMap[entity._locator] : entity.collapsed,
                    tasks,
                    templates,
                    roles
                };

                if (!environment.production) {
                    // Debug point
                    (cloned as unknown as Record<string, unknown>)['matches'] = {
                        searchMatch,
                        rolesMatch: roles.length > 0,
                        templatesMatch: templates.length > 0
                    };
                }

                return cloned;
            }
        } else if (entity.type === 'task') {
            // Task level, filter the task itself
            let maintain = false;
            let matchAllSearch = false;
            let searchMatch = false;
            let matchAllCategory = false;
            let categoryMatch = false;
            let matchAllRole = false;
            let roleMatch = false;

            // Filter approach level if it has no approaches
            for (const criteria of criterias) {
                if (criteria.filter === FilterType.Search) {
                    matchAllSearch = criteria.value === '';

                    if (
                        this._matchesStrings(criteria.value as string, [
                            entity.name, // Task name contains
                            entity.how, // Task how contains
                            entity.purpose, // Task purpose contains
                            ...entity.artefacts.map(a => [
                                a.name, // Artefact name contains
                                a.description, // Artefact description contains
                                a.url.de, // Artefact url is
                                a.url.uk // Artefact url is
                            ]),
                            ...entity.inputArtefacts.map(a => [
                                a.name, // Artefact name contains
                                a.description, // Artefact description contains
                                a.url.de, // Artefact url is
                                a.url.uk // Artefact url is
                            ])
                        ])
                    ) {
                        // Search filter matched
                        searchMatch = true;
                    }
                } else if (criteria.filter === FilterType.SelectCategory) {
                    matchAllCategory = criteria.value.toString() === MatchAllOfType;

                    if (
                        matchAllCategory || // Match all case
                        (criteria.isArray && (criteria.value as unknown[]).includes(entity.category.id)) || // Match one of
                        (!criteria.isArray && criteria.value === entity.category.id) // Match exact
                    ) {
                        categoryMatch = true;
                    }
                } else if (criteria.filter === FilterType.SelectRoles) {
                    matchAllRole = criteria.value.toString() === MatchAllOfType;

                    if (
                        matchAllRole || // Match all case
                        (criteria.isArray && (criteria.value as unknown[]).includes(entity.responsible.id)) || // Match one of
                        (!criteria.isArray && criteria.value === entity.responsible.id) // Match exact
                    ) {
                        roleMatch = true;
                    }
                }
            }

            // Evaluate matches (there is no posibility of early breaking due to the need of filtering at all sublevels)
            if (![matchAllSearch ? null : searchMatch, matchAllCategory ? null : categoryMatch, matchAllRole ? null : roleMatch].some(v => v === false)) {
                maintain = true;
            }

            if (maintain) {
                const cloned = {
                    ...entity,
                    disabled: entity._locator in this._disableMap ? this._disableMap[entity._locator] : entity.disabled,
                    artefacts: entity.artefacts.map(a => ({ ...a })),
                    category: { ...entity.category },
                    responsible: { ...entity.responsible }
                };

                if (!environment.production) {
                    // Debug point
                    (cloned as unknown as Record<string, unknown>)['matches'] = { searchMatch, categoryMatch, roleMatch };
                }

                return cloned;
            }
        }

        return null;
    }

    private _matchesStrings(term: string | RegExp, ...strings: EntityPropStringValue[]): boolean {
        // const regExp = typeof term === 'string' ? new RegExp(term, 'gi') : term;

        // return (strings.flat().filter(Boolean) as string[]).some(s => s.match(regExp) !== null);
        const t = term.toString().toLowerCase();
        return (strings.flat(2).filter(Boolean) as string[]).some(s => s.toLowerCase().includes(t));
    }

    private _determineFilterCriterias(filters: Record<string, IFilterCriteria['value']>): IFilterCriteria[] {
        const filterTypes = Object.keys(filters) as unknown as FilterType[];
        const filterCriterias: IFilterCriteria[] = filterTypes.map(filter => {
            const filterValue = filters[filter];
            const isArray = Array.isArray(filterValue);
            const isBoolean = !isArray ? typeof filterValue === 'boolean' : typeof (filterValue as unknown[])?.[0] === 'boolean';
            const isNumber = !isArray ? typeof filterValue === 'number' : typeof (filterValue as unknown[])?.[0] === 'number';
            const isString = !(isBoolean || isNumber);

            return {
                filter: parseInt(filter as unknown as string, 10),
                value: filterValue,
                isArray,
                isBoolean,
                isNumber,
                isString
            };
        });

        return filterCriterias;
    }

    private _regenerateFilterMap(filtered: EntityDataType[]): void {
        filtered.forEach(e => {
            this._filteredMap[e._locator] = e;

            switch (e.type) {
                case 'phase':
                    this._regenerateFilterMap(e.subphases ?? []);

                    break;

                case 'subphase':
                    this._regenerateFilterMap(e.methods ?? []);

                    break;

                case 'method':
                    this._regenerateFilterMap(e.approaches ?? []);

                    break;

                case 'approach':
                    this._regenerateFilterMap(e.tasks ?? []);

                    break;
            }
        });
    }

    private _extractFilterValues(phases: IPhase[], aggregations: Partial<IFilterValues>): void {
        const extractRoles = FilterType.SelectRoles in aggregations;
        const extractComplexity = FilterType.SelectComplexity in aggregations;
        const extractCategory = FilterType.SelectCategory in aggregations;

        if (!(extractRoles || extractCategory || extractComplexity)) {
            // Stop early if there is nothing to extract
            return;
        }

        phases.forEach(p => {
            p.subphases?.forEach(s => {
                s.methods.forEach(m => {
                    m.approaches.forEach(a => {
                        // Extract approach complexity
                        if (extractComplexity) {
                            // TODO: once data is available
                        }

                        // Extract approach level roles
                        if (extractRoles) {
                            a.roles.forEach(r =>
                                !aggregations[FilterType.SelectRoles]?.some(rr => rr.id === r.id) ? aggregations[FilterType.SelectRoles]?.push(r) : null
                            );
                        }

                        a.tasks.forEach(t => {
                            // Extract task level role
                            if (extractRoles && !aggregations[FilterType.SelectRoles]?.some(rr => rr.id === t.responsible.id)) {
                                aggregations[FilterType.SelectRoles]?.push(t.responsible);
                            }

                            // Extract task level category
                            if (extractCategory && !aggregations[FilterType.SelectCategory]?.some(c => c.id === t.category.id)) {
                                aggregations[FilterType.SelectCategory]?.push(t.category);
                            }
                        });
                    });
                });
            });
        });
    }
}
