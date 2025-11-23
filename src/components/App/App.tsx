import css from "./App.module.css";

import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Loader from "@/components/Loader/Loader";
import ErrorMessages from "@/components/ErrorMessages/ErrorMessages";
import NoNotesMessage from "@/components/NoNotesMessage/NoNotesMessage";

import { fetchNotes } from "@/services/noteService";
import useModalControl from "@/hooks/useModalControl";
import type {
  FetchNotesParams,
  FetchNotesResponse,
} from "@/services/noteService";


export default function App() {
  const createNoteModal = useModalControl();

  const [params, setParams] = useState<FetchNotesParams>({
    search: "",
    page: 1,
    sortBy: "created",
  });

  const { data, isLoading, isSuccess, isError } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ["notes", params.search, params.sortBy, params.page],
    queryFn: () => fetchNotes(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const debounceSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setParams((prev) => ({
        ...prev,
        search: event.target.value,
        page: 1,
      }));
    },
    300
  );

  return (
    <div className={css.app}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: "toast-container",
          style: {
            zIndex: 9999,
          },
        }}
      />
      <header className={css.toolbar}>
        <SearchBox search={params.search ?? ""} onChange={debounceSearch} />
        {isSuccess && data?.totalPages && data.totalPages > 1 && (
          <Pagination
            currentPage={params.page ?? 1}
            totalPages={data.totalPages}
            onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
          />
        )}

        <button className={css.button} onClick={createNoteModal.openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader message="Loading notes, please wait..." />}
      {isError && (
        <ErrorMessages message="There was an error, please try again..." />
      )}
      {isSuccess && data?.notes.length === 0 && (
        <NoNotesMessage isSearch={params.search.length > 0} />
      )}
      {data && !isLoading && <NoteList notes={data.notes} />}

      {createNoteModal.isModalOpen && (
        <Modal onClose={createNoteModal.closeModal}>
          <NoteForm onClose={createNoteModal.closeModal} />
        </Modal>
      )}
    </div>
  );
}
