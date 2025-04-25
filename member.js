function skillsMember() {
  return {
    name: "skillsMember",
    description: "A member with skills",
    properties: {
      skills: {
        type: "array",
        items: {
          type: "string"
        }
      }
    },
    required: ["skills"]
  };
}