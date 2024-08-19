export const defaultTableSettings = {
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
  },
}
