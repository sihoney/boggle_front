import ky from "ky";

const kyClient = ky.create({
  prefixUrl: "http://localhost:18080",

  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          console.log("Unauthorized. Token may be expired.");
        }
      },
    ],
  },
});

export default kyClient;
