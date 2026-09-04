import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import LearningSpaceForm from "../../components/learning-spaces/LearningSpaceForm";
import { learningSpaceService } from "../../services/learningSpaceService";

export default function EditLearningSpacePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error | not-found
  const [space, setSpace] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    learningSpaceService
      .getById(id)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setStatus("not-found");
        } else {
          setSpace(data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // TODO: once the backend is ready, learningSpaceService.update will
      // PUT to /api/learning-spaces/:id instead of resolving mock data.
      await learningSpaceService.update(id, values);
      navigate(`/learning-spaces/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Edit Learning Space
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Update your learning space details.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark">
        {status === "loading" && (
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-white/10" />
            <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-white/10" />
            <div className="h-20 w-full rounded-xl bg-slate-200 dark:bg-white/10" />
            <div className="h-9 w-64 rounded-xl bg-slate-200 dark:bg-white/10" />
          </div>
        )}

        {(status === "error" || status === "not-found") && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <AlertTriangle className="mb-3 h-8 w-8 text-rose-500" />
            <p className="font-medium text-slate-700 dark:text-slate-200">
              {status === "not-found"
                ? "This learning space could not be found."
                : "Couldn't load this learning space."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/learning-spaces")}
              className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Back to Learning Spaces
            </button>
          </div>
        )}

        {status === "success" && space && (
          <LearningSpaceForm
            initialValues={{
              name: space.name,
              category: space.category,
              description: space.description,
              colorId: space.colorId,
              icon: space.icon,
            }}
            submitLabel="Update Space"
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/learning-spaces/${id}`)}
          />
        )}
      </div>
    </div>
  );
}
