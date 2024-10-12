
function Footer() {
  return (
    <div className="absolute bottom-0 h-12 flex items-center justify-center p-1 gap-4 sm:justify-around text-xs z-50 bg-blue-100 w-screen">
      <div>
        <span>Designed and coded by: </span>
        <a
        className="text-blue-600 font-medium"
        href="https://www.timgeenen.com"
        target="blank"
        >Tim Geenen</a>
      </div>
      <div className="flex gap-2 sm:gap-4">
        <a className="w-4 sm:w-6"><img src="src/assets/linkedin_logo.png"/></a>
        <a className="w-4 sm:w-6"><img src="src/assets/github_logo.png" className="bg-white rounded-full"/></a>
      </div>
    </div>
  )
}

export default Footer
