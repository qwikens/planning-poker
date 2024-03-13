import { env } from "./env";
import { server } from "./index";

it("responds with OK", async () => {
  const response = await fetch(server.httpURL);

  expect(await response.text()).toEqual("OK");
  expect(response.status).toEqual(200);
});

it("listens to custom port", () => {
  expect(server.address.port).toEqual(env.PORT);
});
