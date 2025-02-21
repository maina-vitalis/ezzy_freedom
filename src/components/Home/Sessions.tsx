import React from "react";
import SessionComponent from "../SessionComponent";

function Sessions() {
  const sessionData: {
    badge2: string;
    className?: string;
    title: string;
    text: string;
  }[] = [
    {
      badge2: "Group or private sessions",
      className: "bg-secondaryColor/10",
      title: "Understanding The Concept of Addiction",
      text: "Learn the fundamentals of addiction, its causes, and how it affects mental and physical health.",
    },
    {
      badge2: "Group sessions",
      className: "bg-secondaryColor/10",
      title: "Managing Emotions Effectively",
      text: "Discover healthy ways to manage anger and improve emotional regulation in daily life.",
    },
    {
      badge2: "19-60 years",
      className: "bg-secondaryColor/10",
      title: "Couples Therapy & Conflict Resolution",
      text: "Gain insights into improving relationships through communication and conflict resolution strategies.",
    },
    {
      badge2: "15-25 Years",
      className: "bg-primary/10",
      title: "Teenage Mental Health & Well-being",
      text: "Understand common mental health challenges among teenagers and how to support them effectively.",
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-5 h-fit">
      {sessionData.map((item, index) => (
        <SessionComponent key={index} item={item} />
      ))}
    </div>
  );
}

export default Sessions;
