import SectionHeading from "@/components/ui/SectionHeading";
import FeatureCard from "@/components/ui/FeatureCard";

const features = [
  {
    title: "Upload Documents",
    description: "Upload PDFs, DOCX, and text files with one click to keep your knowledge base together.",
    icon: "📄",
  },
  {
    title: "AI Chat",
    description: "Ask natural language questions and get precise answers from your documents.",
    icon: "🤖",
  },
  {
    title: "AI Summary",
    description: "Generate concise summaries that highlight the most important insights.",
    icon: "📝",
  },
  {
    title: "Flashcards",
    description: "Create study flashcards automatically from any uploaded file.",
    icon: "🎯",
  },
  {
    title: "AI Quiz",
    description: "Build quizzes instantly to reinforce learning and comprehension.",
    icon: "🧠",
  },
  {
    title: "Fast Results",
    description: "Enjoy a responsive workspace built for fast document interaction.",
    icon: "⚡",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Powerful AI features for every document workflow"
          subtitle="From document uploads to conversational AI, DocMind brings smarter file interaction to your team."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  );
}
