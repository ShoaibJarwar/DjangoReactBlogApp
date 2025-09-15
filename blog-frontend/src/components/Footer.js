import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container text-center py-2">
        <p className="mb-1">
          © {new Date().getFullYear()} 🚀 Blog Post App. All rights reserved.
        </p>
        <small>
          Built with ❤️ using React & Bootstrap |{" "}
          <a
            href="https://github.com/ShoaibJarwar/DjangoReactBlogApp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-warning"
          >
            GitHub
          </a>
        </small>
      </div>
    </footer>
  );
}
