/**
 * Base class that allow for easy runtime type guarding
 * @template {TThisType} Should always be the type that extends this
 */
export default abstract class Guarded<TThisType> implements IGuarded {
    private readonly _typeName: string;

    /**
     * Constructs a new guarded type based on the template type
     */
    constructor() {
        this._typeName = nameof<TThisType>();
    }

    /**
     * Compares the type
     * @template {TComparisonType} type to compare against
     * @returns `true` if the types match, `false` otherwise
     */
    public IsType<TComparisonType>(): boolean {
        return this._typeName === nameof<TComparisonType>();
    }
}
