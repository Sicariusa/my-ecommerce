import type { Tool } from 'ai';
import { z } from 'zod';

const enhanceBuilderProjectDescription = `
Enhance an existing website builder project by modifying its JSON structure.

This tool is used to apply AI-powered enhancements to website builder projects.
The project JSON contains pages with component trees where each component has:
- id: Unique identifier
- type: Component type (Body, Section, Div, Text, Image, Button, Container, Grid, List, Link, Form)
- props: Component properties
- styles: CSS styles object
- metadata: Additional metadata (name, locked, etc.)
- children: Array of child components

Available Component Types:
- Body: Root container (required, must be first in tree)
- Section: Semantic section container
- Div: Generic container
- Text: Text content with editable tag (p, h1, h2, etc.)
- Image: Image with src and alt
- Button: Interactive button with optional linking
- Container: Flexbox container
- Grid: CSS Grid layout
- List: Ordered/unordered lists
- Link: Anchor tag with href
- Form: Form with configurable fields

Guidelines:
1. Preserve existing component IDs unless creating new components
2. Generate new IDs for new components using format: {type}-{timestamp}-{random}
3. Maintain Body as the root component in each page's tree
4. Keep the project structure intact (id, name, pages, metadata)
5. Ensure all parent-child relationships are valid
6. Apply requested enhancements while maintaining design consistency
7. Return ONLY the enhanced project JSON, no explanations

The tool receives:
- projectJson: Current project as JSON string
- enhancementPrompt: User's enhancement request
`;

export const enhanceBuilderProjectParameters = z.object({
  projectJson: z.string().describe('The current website builder project as a JSON string'),
  enhancementPrompt: z.string().describe('Description of the enhancements to apply to the project'),
});

export const enhanceBuilderProjectTool: Tool = {
  description: enhanceBuilderProjectDescription,
  parameters: enhanceBuilderProjectParameters,
};
