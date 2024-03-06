import { IndexeddbPersistence } from "y-indexeddb";
import * as Y from "yjs";

// Create a Yjs document
const ydoc = new Y.Doc();

// Persist state to IndexedDB your workspaceId
const indexeddbProvider = new IndexeddbPersistence("free-planning-poker", ydoc);

// Export the Yjs document and the IndexedDB provider
export { ydoc, indexeddbProvider };
