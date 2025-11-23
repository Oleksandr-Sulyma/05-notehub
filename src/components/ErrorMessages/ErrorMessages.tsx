import css from "./ErrorMessages.module.css";

interface ErrorMessagesProps {
  message: string;
}

export default function ErrorMessages({message}: ErrorMessagesProps) {
  return <p className={css.text}>{message}</p>;
}
