export interface IAttachableTop<T extends IAttachableTop<T>>
{
    attach(attachable: IAttachableTop<T>): void
    sortBlocks(parent: Phaser.Group): void
}