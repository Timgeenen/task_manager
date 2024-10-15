
function Footer() {
  return (
    <div className="fixed bottom-0 h-10 sm:h-14 flex items-center justify-center p-1 gap-4 sm:justify-around text-xs z-50 bg-blue-300 w-screen">
      <div>
        <span>Designed and coded by: </span>
        <a
        className="text-blue-700 font-medium"
        href="https://www.timgeenen.com"
        target="blank"
        >Tim Geenen</a>
      </div>
      <div className="flex gap-2 sm:gap-4">
        <a className="w-4 sm:w-6"><img src="../../linkedin_logo.png"/></a>
        <a className="w-4 sm:w-6"><img src="../../github_logo.png" className="bg-white rounded-full"/></a>
      </div>
    </div>
  )
}

export default Footer
