const normalizePath = (path) => {
  if (path.length > 1) {
    return path.replace(/\/$/, "");
  }
  return path;
};

const currentPath = normalizePath(window.location.pathname);

document.querySelectorAll(".nav-link").forEach((link) => {
  const linkPath = normalizePath(new URL(link.href).pathname);

  const isActive =
    linkPath === "/"
      ? currentPath === "/"
      : currentPath === linkPath || currentPath.startsWith(linkPath + "/");

  if (isActive) {
    link.classList.remove(
      "text-stone-700",
      "font-medium",
      "border-transparent"
    );

    link.classList.add(
      "text-stone-900",
      "font-semibold",
      "border-stone-800"
    );
  }
});