import ILocalizationText from "./localization.text";

export default interface ISeoData {
	page: string;
	title: ILocalizationText;
	description: ILocalizationText;
	keywords: ILocalizationText;
	image: string;
}
