export default function MetricCard({
    title,
    value,
    subtitle,
    icon,
    className,
  }) {
    return (
      <article className={className}>
        <div className="p-6 mx-auto w-full bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] max-md:px-5 max-md:mt-6">
          <div className="flex gap-5 justify-between py-0.5 w-full bg-black bg-opacity-0">
            <h3 className="text-base leading-none text-gray-600">{title}</h3>
            <div className="flex overflow-hidden justify-center items-center self-start mt-1 min-h-4">
              <img
                src={icon}
                alt={`${title} icon`}
                className="object-contain self-stretch my-auto w-3 aspect-[0.75]"
              />
            </div>
          </div>
          <p className="z-10 pt-0 pb-3.5 mt-4 text-3xl font-bold text-gray-800 bg-black bg-opacity-0 max-md:pr-5">
            {value}
          </p>
          <p className="pb-1.5 mt-2 text-sm text-gray-500 bg-black bg-opacity-0 max-md:pr-5">
            {subtitle}
          </p>
        </div>
      </article>
    );
  }
  