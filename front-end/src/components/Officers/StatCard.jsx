export function StatCard({ icon, title, value }) {
  return (
    <article className="flex flex-col gap-4 justify-center items-center p-8 h-36 bg-white rounded-xl shadow w-[258px] max-md:min-w-[200px] max-md:w-[calc(50%_-_8px)] max-sm:w-full">
      <header className="flex gap-2 items-center">
        <div className="w-6 h-6 flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-lg font-semibold leading-5 text-gray-800">
          {title}
        </h2>
      </header>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </article>
  );
}
export default StatCard;
