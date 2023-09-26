
module.exports = {
  documentation: {
    config: {
      "x-strapi-config": {
        mutateDocumentation: (generatedDocumentationDraft) => {
          console.log("generatedDocumentationDraft", generatedDocumentationDraft);
          Object.keys(generatedDocumentationDraft.paths).forEach((path) => {
            // check if it has {id} in the path
            if (path.includes("{id}")) {
              // add `populate` as params
              if (generatedDocumentationDraft.paths[path].get) {
                if (!generatedDocumentationDraft.paths[path].get.parameters.find((param) => param.name === "populate")) {
                  generatedDocumentationDraft.paths[path].get.parameters.push(
                    {
                      "name": "populate",
                      "in": "query",
                      "description": "Relations to return",
                      "deprecated": false,
                      "required": false,
                      "schema": {
                        "type": "string"
                      }
                    },
                  );
                }
              }
            }
          });
        },
      },
    },
  },
};