function requireUser(req: any, reply: any) {
  if (!req.user?.id) {
    reply.code(401).send({ message: "Unauthorized" });
    return null;
  }
  return req.user;
}
export { requireUser };
