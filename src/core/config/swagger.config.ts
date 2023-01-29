import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import fs from "fs";
import path from "path";
import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
//TODO Check issue for below import: https://github.com/typestack/class-transformer/issues/563
import { defaultMetadataStorage as classTransformerdefaultMetadataStorage } from "class-transformer/cjs/storage";
import { env } from "../../env";
import { Logger } from "../../logger";

export const getSwaggerSpec = (dirname: string) => {
	const routingControllersOptions = {
		controllers: [dirname + "/controllers/*.ts"],
		routePrefix: env.app.routePrefix,
	};

	const schemas = validationMetadatasToSchemas({
		classTransformerMetadataStorage: classTransformerdefaultMetadataStorage,
		refPointerPrefix: "#/components/schemas/",
	});

	const storage = getMetadataArgsStorage();

	const spec = routingControllersToSpec(storage, routingControllersOptions, {
		components: {},
		info: {
			description: "Generated with `routing-controllers-openapi`",
			title: `${env.app.name} API`,
			version: `${env.app.version}`,
		},
	});

	fs.writeFile(
		path.resolve(process.cwd(), "docs/swagger.json"),
		JSON.stringify(spec, null, 4),
		(error) => {
			if (error) {
				const log = new Logger("Docs");
				log.error(error.message);
			}
		}
	);

	return spec;
};
