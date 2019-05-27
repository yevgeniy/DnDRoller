import * as React from "react";
import Layout from "./Layout";

import {
  PageInstanceCharacter,
  PageInstanceCharacters
} from "./PageInstanceCharacter";

export default props => {
  return (
    <Layout title="Instance">
      <PageInstanceCharacters>
        <PageInstanceCharacter />
        <PageInstanceCharacter />
      </PageInstanceCharacters>
    </Layout>
  );
};
