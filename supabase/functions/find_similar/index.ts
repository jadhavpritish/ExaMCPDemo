// Edge function to call Exa AI's /findSimilar endpoint

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
      status: 200,
    });
  }

  try {
    // Parse the request body to get the URL
    const { url } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    // Call the Exa AI's /findSimilar endpoint
    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/findSimilar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-pica-secret": Deno.env.get("PICA_SECRET_KEY") || "",
          "x-pica-connection-key":
            Deno.env.get("PICA_EXA_CONNECTION_KEY") || "",
          "x-pica-action-id":
            "conn_mod_def::GCMYlnYFSss::5aCHrI54Tk2x4WKKQKmysg",
        },
        body: JSON.stringify({ url }),
      },
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 400,
    });
  }
});
