from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Disable browser caching during local development.
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_head(self):
        # Ignore conditional requests so changed CSS/JS is always re-fetched.
        if "If-Modified-Since" in self.headers:
            del self.headers["If-Modified-Since"]
        if "If-None-Match" in self.headers:
            del self.headers["If-None-Match"]
        return super().send_head()


if __name__ == "__main__":
    host = "0.0.0.0"
    port = 8000
    with ThreadingHTTPServer((host, port), NoCacheHandler) as server:
        print(f"Serving without cache on http://localhost:{port}")
        server.serve_forever()
