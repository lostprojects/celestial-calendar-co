import { default as BirthChartForm } from "./birthchart-form";

export const BirthChartSection = () => {
  return (
    <section className="relative w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-background-sand py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif font-bold mb-6 text-primary-dark text-center">
          Calculate Your Birth Chart
        </h2>
        <p className="text-lg text-primary-dark/80 font-mono mb-12 text-center">
          Enter your birth details to receive your personalized celestial roadmap
        </p>
        <BirthChartForm />
      </div>
    </section>
  );
};