import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useId } from "react";

import type { NoteFormValues } from "@/types/note";

interface NoteFormProps {
  onSubmit: (values: NoteFormValues) => void;
  onClose: () => void;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const NoteFormSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required.")
    .min(3, "Title must be at least 3 characters long.")
    .max(50, "Title must be no more than 50 characters long."),
  content: Yup.string()
    .trim()
    .max(500, "Content must be no more than 500 characters long."),
  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Tag must be one of: Todo, Work, Personal, Meeting, Shopping."
    )
    .required("Tag is required."),
});

export default function NoteForm({ onSubmit, onClose }: NoteFormProps) {
  const fieldId = useId();

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    onSubmit(values);
    actions.resetForm({ values: initialValues });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={NoteFormSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
            autoFocus
          />
          <ErrorMessage
            name="title"
            component="div"
            className={css.errorMessage}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage
            name="content"
            component="div"
            className={css.errorMessage}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage
            name="tag"
            component="div"
            className={css.errorMessage}
          />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onClose}
            disabled={false}
          >
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
