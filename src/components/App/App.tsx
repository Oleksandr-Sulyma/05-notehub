import css from "./App.module.css";

import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  useQuery,
  useQueryClient,
  useMutation,
  keepPreviousData,
} from "@tanstack/react-query";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NoNotesMessage from "@/components/NoNotesMessage/NoNotesMessage";

import { fetchNotes, createNote } from "@/services/noteService";
import useModalControl from "@/hooks/useModalControl";
import type {
  FetchNotesParams,
  FetchNotesResponse,
} from "@/services/noteService";
import type { NoteFormValues } from "@/types/note";

export default function App() {
  const createNoteModal = useModalControl();
  const queryClient = useQueryClient();

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

  const mutation = useMutation({
    mutationFn: (note: NoteFormValues) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      createNoteModal.closeModal();
    },
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

  const handleCreateNote = (values: NoteFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox search={params.search ?? ""} onChange={debounceSearch} />
        {isSuccess && data?.totalPages > 1 && (
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

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data?.notes.length === 0 && (
        <NoNotesMessage isSearch={params.search.length > 0} />
      )}
      {data && !isLoading && <NoteList notes={data.notes} />}

      {createNoteModal.isModalOpen && (
        <Modal onClose={createNoteModal.closeModal}>
          <NoteForm
            onSubmit={handleCreateNote}
            onClose={createNoteModal.closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
