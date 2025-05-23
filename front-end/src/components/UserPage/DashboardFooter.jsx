export default function DashboardFooter() {
    return (
      <footer className="flex flex-col justify-center px-20 py-px mt-8 mb-0 w-full bg-white max-md:px-5 max-md:mb-2.5 max-md:max-w-full">
        <div className="flex flex-col justify-center px-4 py-6 w-full bg-black bg-opacity-0 max-md:max-w-full">
          <div className="flex flex-wrap gap-10 w-full bg-black bg-opacity-0 max-md:max-w-full">
            <p className="text-sm leading-none text-gray-600">
              © 2025 PDAM Monitoring System
            </p>
            <nav className="flex flex-1 gap-5 px-0.5 py-1 bg-black bg-opacity-0">
              <a href="#" className="flex gap-2">
                <div className="flex overflow-hidden justify-center items-center self-start min-h-4">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/f417a85b09d8017f1c2de8bf1e26a5f534ddd1d3?placeholderIfAbsent=true&apiKey=c8560796e66545038559eddfb5c3ceff"
                    alt="Help icon"
                    className="object-contain self-stretch my-auto w-4 aspect-square"
                  />
                </div>
                <span className="text-base leading-none text-gray-600">
                  Bantuan
                </span>
              </a>
              <a href="#" className="flex gap-2">
                <div className="flex overflow-hidden justify-center items-center self-start min-h-4">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/2118b89e9aa5dfb538621f295e50185fb0276fa1?placeholderIfAbsent=true&apiKey=c8560796e66545038559eddfb5c3ceff"
                    alt="Settings icon"
                    className="object-contain self-stretch my-auto w-4 aspect-square"
                  />
                </div>
                <span className="text-base leading-none text-gray-600">
                  Pengaturan
                </span>
              </a>
            </nav>
          </div>
        </div>
      </footer>
    );
  }
  