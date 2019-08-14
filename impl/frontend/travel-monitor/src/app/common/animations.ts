import { transition, animate, style, trigger, state } from '@angular/animations';

const AnimationsConfig = {
    defaultDuration: 200,
    enter: {
        fadeIn: (duration: number = AnimationsConfig.defaultDuration) => {
            return transition('void => *', [
                style({ opacity: 0 }), 
                animate(duration, style({opacity: 1}))
            ]);
        },
        scaleIn: (duration: number = AnimationsConfig.defaultDuration) => {
            return transition('void => *', [
                style({ transition: 'scale(0)' }), 
                animate(duration, style({transition: 'scale(1)'}))
            ]);
        },
    },
    leave: {
        fadeOut: (duration: number = AnimationsConfig.defaultDuration) => {
            return transition('* => void', [
                style({ opacity: 1 }), 
                animate(duration, style({opacity: 0}))
            ]);
        }
    },
    always: {
        // fadeIn: { opacity: 0 }
    }
}


export class AnimationsFactory {

    public static animations = {
        enter: {
            fadeIn: 'fadeIn',
            scaleIn: 'scaleIn',
        },
        leave: {
            fadeOut: 'fadeOut',
        },
    };

    public static makeEnterLeaveAnimation(triggerName: string, enterAnimation: string, leaveAnimation: string, duration?: number) {
        const animationArray = [];
        animationArray.push(AnimationsConfig.enter[enterAnimation](duration));
        animationArray.push(AnimationsConfig.leave[leaveAnimation](duration));
        let normalStateStyles: any = {};
        const enterAnimationAlwaysStyles = AnimationsConfig.always[enterAnimation];
        if (enterAnimationAlwaysStyles !== undefined) {
            Object.keys(enterAnimationAlwaysStyles).forEach(function(key,index) {
                normalStateStyles[key] = enterAnimationAlwaysStyles[key];
            });
        }
        const leaveAnimationAlwaysStyles = AnimationsConfig.always[leaveAnimation];
        if (leaveAnimationAlwaysStyles !== undefined) {
            Object.keys(enterAnimationAlwaysStyles).forEach(function(key,index) {
                normalStateStyles[key] = enterAnimationAlwaysStyles[key];
            });
        }
        if (normalStateStyles !== {}) {
            animationArray.push(state('*', style(normalStateStyles)))
        }
        const a =  trigger(triggerName, animationArray);
        console.log(a);
        return a;
    }

}