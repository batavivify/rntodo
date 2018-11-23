import {
    SET_ADD_DIALOG, SET_DELETE_DIALOG, SET_EDIT_DIALOG,
    SET_ITEM_OBJECT,
    SET_ITEM_VALUE
} from './actionTypes'

export const setAddDialog = (addDialog) => ({
    type: SET_ADD_DIALOG,
    payload: {
        addDialog: addDialog
    }
});

export const setEditDialog = (editDialog) => ({
    type: SET_EDIT_DIALOG,
    payload: {
        editDialog: editDialog
    }
});

export const setDeleteDialog = (deleteDialog) => ({
    type: SET_DELETE_DIALOG,
    payload: {
        deleteDialog: deleteDialog
    }
});

export const setItemValue = (name, value) => ({
    type: SET_ITEM_VALUE,
    payload: {
        name: name,
        value: value
    }
});

export const setItemObject = item => ({
    type: SET_ITEM_OBJECT,
    payload: {
        item: item
    }
});