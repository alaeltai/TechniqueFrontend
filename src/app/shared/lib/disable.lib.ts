import { EntityDataType } from '../types/types';

export function enforceDisabledStatusAtLocation(entity: EntityDataType, disabled: boolean): void {
    // Enforce the new status on the entity itself
    entity.disabled = disabled;

    // Enforce the new status on all children
    enforceDisabledOnChildren(entity, disabled);

    // Enforce the new status on affected parents
    enforceDisabledOnParents(entity, disabled);
}

function enforceDisabledOnChildren(entity: EntityDataType, disabled: boolean): void {
    if (entity.type === 'phase') {
        entity.subphases?.forEach(s => enforceDisabledOnChildren(s, disabled));
    } else if (entity.type === 'subphase') {
        entity.methods?.forEach(m => enforceDisabledOnChildren(m, disabled));
    } else if (entity.type === 'method') {
        entity.approaches?.forEach(a => enforceDisabledOnChildren(a, disabled));
    } else if (entity.type === 'approach' || entity.type === 'task') {
        // No task level disable status
    }

    entity.disabled = disabled;
}

function enforceDisabledOnParents(entity: EntityDataType, disabled: boolean): void {
    if (entity.type === 'phase') {
        // No phase level parents
        return;
    }

    if (!disabled) {
        // Ensure enablement regardless of prior status
        if (entity.parent) {
            entity.parent.disabled = disabled;

            enforceDisabledOnParents(entity.parent, disabled);
        }
    } else {
        // Only disable parent levels when all children of same type are disabled
        const parent = entity.parent as EntityDataType;
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
                parent.disabled = disabled;

                // Ensure disabling further in the parent chain
                enforceDisabledOnParents(parent, disabled);
            }
        }
    }
}
