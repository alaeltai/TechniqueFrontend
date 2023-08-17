import { transition, style, animate, trigger, state, query } from '@angular/animations';

export const enterTransition = transition(':enter', [
    style({
        opacity: 0
    }),
    animate(
        '.6s ease-in',
        style({
            opacity: 1
        })
    )
]);

export const leaveTransion = transition(':leave', [
    style({
        opacity: 1
    }),
    animate(
        '.6s ease-out',
        style({
            opacity: 0
        })
    )
]);

export const fadeIn = trigger('fadeIn', [enterTransition]);

export const fadeOut = trigger('fadeOut', [leaveTransion]);

export const bottomFadeIn = trigger('bottomFadeIn', [
    transition(':enter', [
        style({
            position: 'absolute',
            left: 0,
            width: '100%',
            opacity: 0,
            transform: 'scale(0) translateY(100%)'
        }),

        animate('600ms ease', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
    ])
]);

export const fadeOutState = trigger('fadeOutState', [
    state(
        'true',
        style({
            opacity: 0
        })
    ),
    transition('false => true', animate('300ms ease-out'))
]);

export const expandAndShrink = trigger('expandAndShrink', [
    state(
        'true',
        style({
            opacity: 0,
            width: '0%'
        })
    ),
    state(
        'false',
        style({
            opacity: 1,
            width: '100%'
        })
    ),
    transition('true => false', animate('300ms ease-in')),
    transition('false => true', animate('300ms ease-out'))
]);
