export default function DashboardHeader() {
    return (
      <header className="px-20 w-full bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col justify-center p-4 w-full bg-black bg-opacity-0 max-md:max-w-full">
          <div className="flex flex-wrap gap-10 w-full bg-black bg-opacity-0 max-md:max-w-full">
            <div className="flex flex-1 gap-3 items-start py-px my-auto bg-black bg-opacity-0">
              <div className="flex overflow-hidden justify-center items-center min-h-6">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/77b75390f9d3f7c63ca9947512a59e2bc544e491?placeholderIfAbsent=true&apiKey=c8560796e66545038559eddfb5c3ceff"
                  alt="PDAM Monitor Logo"
                  className="object-contain self-stretch my-auto aspect-[1.12] w-[27px]"
                />
              </div>
              <h1 className="text-xl font-bold leading-none text-gray-800 basis-auto">
                PDAM Monitor
              </h1>
            </div>
            <div className="flex flex-1 gap-4 text-base leading-none text-gray-700 bg-black bg-opacity-0">
              <div className="flex gap-2 bg-black bg-opacity-0">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/be338372a46d437cb699d11272ee4d185e5a52f4?placeholderIfAbsent=true&apiKey=c8560796e66545038559eddfb5c3ceff"
                  alt="Admin Profile"
                  className="object-contain shrink-0 w-8 rounded-full aspect-square"
                />
                <span className="self-start basis-auto">Admin PDAM</span>
              </div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/527c85911c46f927ed34425ddbef526dbebd746c?placeholderIfAbsent=true&apiKey=c8560796e66545038559eddfb5c3ceff"
                alt="Menu"
                className="object-contain shrink-0 my-auto w-3.5 aspect-[0.87]"
              />
            </div>
          </div>
        </div>
      </header>
    );
  }
  