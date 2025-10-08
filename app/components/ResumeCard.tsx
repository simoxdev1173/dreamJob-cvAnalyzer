// src/components/ResumeCard.tsx
import ScoreCircle from "./ScoreCircle";
import { useEffect, useState } from "react";

type Resume = {
  id: string;
  companyName?: string;
  jobTitle?: string;
  feedback: { overallScore: number };
  imagePath: string;
};

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    // If you later fetch signed URLs, replace this with your fetcher.
    setResumeUrl(imagePath || "");
  }, [imagePath]);

  return (
    <a href={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
          {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
          {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="h-full w-full">
            <img
              src={resumeUrl}
              alt={`${companyName ?? "Resume"} preview`}
              className="h-[350px] w-full max-sm:h-[200px] object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </a>
  );
};

export default ResumeCard;
