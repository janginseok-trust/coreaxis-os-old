export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Missing ID" }, { status: 400 });

  const res = await fetch(`http://localhost:5000/api/detail/${id}`);
  const data = await res.json();

  return Response.json(data);
}
