import actionsTypes from './actionTypes.js'

export const addedItem = (id) => (
    {
        type: actionsTypes.ADDED_ITEM,
        payload: {
            id,
        }
    }
);

export const removedItem = (id) => (
    {
        type: actionsTypes.REMOVED_ITEM,
        payload: {
            id,
        }
    }
);