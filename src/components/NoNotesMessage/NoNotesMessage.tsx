import css from "./NoNotesMessage.module.css";

interface NoNotesMessageProps {
  isSearch?: boolean;
}

export default function NoNotesMessage({ isSearch = false }: NoNotesMessageProps) {
  return (
    <p className={css.text}>
      {isSearch
        ? "No notes found for the given search criteria."
        : "You have no saved notes yet."}
    </p>
  );
}