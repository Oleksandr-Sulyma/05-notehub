import axios from "axios";

import type { Note, NoteFormValues } from "@/types/note";

const NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface FetchNotesParams {
  search: string;
  page: number;
  sortBy: "created" | "updated";
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${NOTEHUB_TOKEN}`;
axios.defaults.timeout = 2000;

export const fetchNotes = async ({
  search,
  page,
  sortBy,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      search,
      page,
      perPage: 12,
      sortBy,
    },
  });

  return data;
};

export const createNote = async (noteData: NoteFormValues): Promise<Note> => {
  const { data } = await axios.post<Note>("/notes", noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(`/notes/${id}`);
  return data;
};
