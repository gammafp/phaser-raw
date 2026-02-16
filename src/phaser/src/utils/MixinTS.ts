/**
 * Temporary Mixin utility for TypeScript ES6 modules.
 * 
 * Note: This is transitional. The mixin pattern will be replaced
 * with proper TypeScript interfaces/composition in the future.
 */

export let ignoreFinals = false;

const hasGetterOrSetter = (desc: PropertyDescriptor): boolean =>
    (typeof desc.get === 'function') || (typeof desc.set === 'function');

const getPropertyDescriptor = (source: any, key: string): PropertyDescriptor | false => {
    const desc = Object.getOwnPropertyDescriptor(source, key);
    
    if (!desc) return false;

    if (desc.value && typeof desc.value === 'object') {
        const nested = desc.value as PropertyDescriptor;

        // Support legacy pattern: property value is itself a descriptor object.
        if (hasGetterOrSetter(nested) || 'value' in nested || 'writable' in nested || 'enumerable' in nested || 'configurable' in nested) {
            return nested;
        }
    }

    if (hasGetterOrSetter(desc)) {
        return {
            ...desc,
            enumerable: desc.enumerable ?? true,
            configurable: desc.configurable ?? true
        };
    }

    return {
        ...desc,
        enumerable: desc.enumerable ?? true,
        configurable: desc.configurable ?? true,
        writable: desc.writable ?? true
    };
};

const copyToPrototype = (target: any, source: any): void => {
    for (const key in source) {
        if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

        const existing = Object.getOwnPropertyDescriptor(target.prototype, key);
        if (existing?.configurable === false) {
            if (ignoreFinals) continue;
            throw new Error(`Cannot override final property '${key}'`);
        }

        const descriptor = getPropertyDescriptor(source, key);
        
        if (descriptor !== false) {
            Object.defineProperty(target.prototype, key, descriptor);
        }
    }
};

/**
 * Applies mixins to a class prototype.
 * 
 * @example
 * ```typescript
 * static {
 *     Mixin(this, [Alpha, BlendMode, Transform]);
 * }
 * ```
 */
export function Mixin(targetClass: any, mixins: any | any[]): void {
    if (!mixins) return;

    const mixinArray = Array.isArray(mixins) ? mixins : [mixins];

    for (const mixin of mixinArray) {
        const source = mixin.prototype || mixin;
        copyToPrototype(targetClass, source);
    }
}
