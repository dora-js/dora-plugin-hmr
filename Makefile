
publish:
	npm run build
	npm publish

publish-sync: publish
	cnpm sync dora-plugin-hmr
	tnpm sync dora-plugin-hmr
