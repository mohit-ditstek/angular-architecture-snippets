import { Validators } from "@angular/forms";

export const goalFormConfig = (goal,entityType,entityId) => {
    return {
      id: {
        validators: [goal?.id]
      },
      entityType: {
        validators: [entityType]
      },
      entityId: {
        validators: [entityId]
      },
      version: {
        validators: [goal?.version ? goal.version : 0]
      },
      createdDate: {
        validators: [goal?.createdDate ? goal?.createdDate : new Date()]
      },
      title: {
        validators: [goal?.title, Validators.compose([Validators.required, Validators.maxLength(50)])],
        errorMessages: {
          required: 'Title is a required field',
          maxlength: 'Title cannot have more than 50 character'
        }
      },
      dueDate: {
        validators: [goal?.dueDate, Validators.compose([Validators.required])],
        errorMessages: {
          required: 'Due date is a required field',
        }
      },
      description: {
        validators: [goal?.description, Validators.compose([Validators.required, Validators.maxLength(50)])],
        errorMessages: {
          required: 'Detail is a required field',
          maxlength: 'Detail cannot have more than 100 character'
        }
      },
    }
  }