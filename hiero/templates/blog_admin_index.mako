<a href="${request.route_url('hiero_admin_entry_create')}">Create New</a>
<br />
% for entry in entries:
${entry.title} [ <a href="${request.route_url('hiero_admin_entry_edit', slug=entry.slug) }">Edit</a>]<br />
% endfor
