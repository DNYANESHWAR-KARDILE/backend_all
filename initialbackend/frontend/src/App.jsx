import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000";

function App() {
  const [notes, setNotes] = useState([]);

  // Create note states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Edit note states
  const [editNoteId, setEditNoteId] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  // =========================
  // GET ALL NOTES
  // =========================
  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/notes`);

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();

      setNotes(data.notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // =========================
  // CREATE NOTE
  // =========================
  const createNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: Date.now(),
          title: title,
          discription: description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      // Clear form
      setTitle("");
      setDescription("");

      // Refresh notes
      fetchNotes();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // =========================
  // DELETE NOTE
  // =========================
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // =========================
  // START EDIT
  // =========================
  const startEdit = (note) => {
    setEditNoteId(note._id);
    setEditDescription(note.discription);
  };

  // =========================
  // UPDATE NOTE
  // =========================
  const updateNote = async (id) => {
    if (!editDescription.trim()) {
      alert("Description cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          discription: editDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      // Exit edit mode
      setEditNoteId(null);
      setEditDescription("");

      // Refresh notes
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const cancelEdit = () => {
    setEditNoteId(null);
    setEditDescription("");
  };

  // =========================
  // FETCH NOTES ON PAGE LOAD
  // =========================
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">

      <div className="mx-auto max-w-5xl">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-10 text-center">

          <h1 className="text-4xl font-bold text-slate-900">
            My Notes
          </h1>

          <p className="mt-2 text-slate-500">
            Create, edit and manage your notes
          </p>

        </div>

        {/* =========================
            CREATE NOTE
        ========================= */}
        <div className="mb-10 rounded-2xl bg-white p-6 shadow-lg">

          <h2 className="mb-5 text-2xl font-semibold text-slate-800">
            Create New Note
          </h2>

          <form
            onSubmit={createNote}
            className="space-y-4"
          >

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Title
              </label>

              <input
                type="text"
                placeholder="Enter note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                placeholder="Write your note..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Add Button */}
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
            >
              + Add Note
            </button>

          </form>

        </div>

        {/* =========================
            NOTES HEADER
        ========================= */}
        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-slate-800">
            All Notes
          </h2>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            {notes.length} Notes
          </span>

        </div>

        {/* =========================
            NO NOTES
        ========================= */}
        {notes.length === 0 ? (

          <div className="rounded-2xl bg-white p-12 text-center shadow">

            <div className="mb-4 text-5xl">
              📝
            </div>

            <h3 className="text-xl font-semibold text-slate-700">
              No notes yet
            </h3>

            <p className="mt-2 text-slate-400">
              Create your first note above.
            </p>

          </div>

        ) : (

          /* =========================
             NOTES GRID
          ========================= */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {notes.map((note) => (

              <div
                key={note._id}
                className="rounded-2xl bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >

                {/* =========================
                    NOTE TITLE
                ========================= */}
                <h3 className="mb-4 break-words text-xl font-bold text-slate-800">
                  {note.title}
                </h3>

                {/* =========================
                    DESCRIPTION
                ========================= */}

                {editNoteId === note._id ? (

                  /* EDIT MODE */
                  <textarea
                    value={editDescription}
                    onChange={(e) =>
                      setEditDescription(e.target.value)
                    }
                    rows="6"
                    className="mb-4 w-full resize-none rounded-xl border border-blue-400 px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-200"
                  />

                ) : (

                  /* NORMAL MODE */
                  <p className="mb-6 min-h-20 whitespace-pre-wrap break-words text-slate-600">
                    {note.discription}
                  </p>

                )}

                {/* =========================
                    BUTTONS
                ========================= */}

                <div className="flex gap-3 border-t border-slate-100 pt-4">

                  {editNoteId === note._id ? (

                    /* =========================
                       EDIT MODE BUTTONS
                    ========================= */

                    <>
                      <button
                        onClick={() =>
                          updateNote(note._id)
                        }
                        className="flex-1 rounded-lg bg-green-100 px-4 py-2 font-semibold text-green-700 transition hover:bg-green-200"
                      >
                        ✓ Save
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="flex-1 rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-600 transition hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                    </>

                  ) : (

                    /* =========================
                       NORMAL MODE BUTTONS
                    ========================= */

                    <>
                      <button
                        onClick={() => startEdit(note)}
                        className="flex-1 rounded-lg bg-amber-100 px-4 py-2 font-semibold text-amber-700 transition hover:bg-amber-200"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteNote(note._id)
                        }
                        className="flex-1 rounded-lg bg-red-100 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-200"
                      >
                        🗑 Delete
                      </button>
                    </>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default App;