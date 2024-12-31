import { default as BirthChartForm } from "./birthchart-form";

export const BirthChartSection = () => {
  return (
    <section className="relative w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-background-sand py-24 text-center">
      <h2 className="text-4xl font-serif font-bold mb-12 text-primary-dark">
        Calculate Your Birth Chart
      </h2>
      <BirthChartForm />
    </section>
  );
};