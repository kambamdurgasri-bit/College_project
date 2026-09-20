import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LearningSpaceForm from "../../components/learning-spaces/LearningSpaceForm";
import { learningSpaceService } from "../../services/learningSpaceService";

export default function CreateLearningSpacePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // TODO: once the backend is ready, learningSpaceService.create will
      // POST to /api/learning-spaces instead of resolving mock data.
      await learningSpaceService.create(values);
      navigate("/learning-spaces");
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
            Create Learning Space
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add a new subject or topic to start learning.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800/80 dark:bg-surface-dark-card dark:shadow-card-dark">
        <LearningSpaceForm
          submitLabel="Create Space"
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/learning-spaces")}
        />
      </div>
    </div>
  );
}
