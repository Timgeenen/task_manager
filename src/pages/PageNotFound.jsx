
function PageNotFound({ message }) {
  return (
    <div className="w-full flex flex-col gap-4 items-center mt-8 p-2">
      <span className="text-xl sm:text-4xl font-medium">Status 404: Page Not Found</span>
      <span className="text-xs font-light sm:text-lg">{message}</span>
    </div>
  )
}

export default PageNotFound
