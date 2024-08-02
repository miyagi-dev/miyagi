# Presentation vs Development mode

_miyagi_ supports two different kinds of views:

**Development mode** shows additional information as the mock data being, if it complies with the provided schema and so on. When using the development server (using `miyagi start`), this mode is activated by default.

In the **presentation mode**, _miyagi_ hides this information as this is often irrelevant when showcasing the component library to non-developers. By default, this mode is activated when creating static builds (using `miyagi build`).

Both views are always available though and can be toggled via the settings menu in the UI. The selected mode is stored in a cookie and will be restored on subsequent visits.
