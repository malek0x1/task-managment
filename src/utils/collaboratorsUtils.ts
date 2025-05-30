export const ensureCollaboratorsArray = (collaborators: any): any[] => {
  if (!collaborators) return [];
  if (!Array.isArray(collaborators)) {
    return typeof collaborators === 'object' ? [collaborators] : [];
  }
  return collaborators;
};