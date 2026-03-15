import SectionHeader from "@/components/common/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	CardSim,
	EarthLock,
	Eraser,
	EthernetPort,
	EyeClosed,
	FingerprintPattern,
	Megaphone,
	MessageSquareLock,
	MonitorCloud,
	Plane,
	QrCode,
	ScanEye,
	ScrollText,
	Settings2,
	ShieldUser,
	SmartphoneNfc,
	Sprout,
	SquareAsterisk,
	TowerControl,
	UserKey
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Privacy Policy - BuildHub",
	description:
		"BuildHub's comprehensive privacy policy explaining how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
	return (
		<div className="py-20 pt-10">
			<div className="wrapper">
				<div className="mb-6">
					<SectionHeader
						title="Privacy Policy"
						icon={MessageSquareLock}
						description="Your privacy is important to us. This policy explains how we collect, use, and protect your information."
					/>
				</div>

				<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-auto gap-6">
					<Card className="md:col-span-2 lg:col-span-3">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<ScrollText className="size-5 text-primary" />
								Introduction
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4 text-muted-foreground">
								<p>
									At BuildHub, we are committed to protecting
									your privacy and ensuring the security of
									your personal information. This Privacy
									Policy explains how we collect, use,
									disclose, and safeguard your information
									when you use our platform.
								</p>
								<p>
									By using BuildHub, you agree to the
									collection and use of information in
									accordance with this policy. If you disagree
									with any part of this privacy policy, please
									do not use our platform.
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="lg:row-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<QrCode className="size-5 text-primary" />
								Information We Collect
							</CardTitle>
						</CardHeader>
						<Separator />
						<CardContent>
							<div className="space-y-6">
								<div>
									<h4 className="font-semibold mb-2">
										Personal Information
									</h4>
									<p className="text-muted-foreground">
										When you create an account, we collect
										information such as your name, email
										address, and other details you provide
										during registration.
									</p>
								</div>
								<div>
									<h4 className="font-semibold mb-2">
										Project Information
									</h4>
									<p className="text-muted-foreground">
										We collect information about projects
										you submit, including descriptions,
										links, images, and any other content you
										provide to showcase your work.
									</p>
								</div>
								<div>
									<h4 className="font-semibold mb-2">
										Usage Data
									</h4>
									<p className="text-muted-foreground">
										We collect information about how you use
										our platform, including pages visited,
										features used, and interaction patterns
										to improve our services.
									</p>
								</div>
								<div>
									<h4 className="font-semibold mb-2">
										Technical Information
									</h4>
									<p className="text-muted-foreground">
										We automatically collect technical
										information such as IP address, browser
										type, device information, and access
										logs for security and analytics
										purposes.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<SquareAsterisk className="size-5 text-primary" />
								How We Use Your Information
							</CardTitle>
						</CardHeader>
						<Separator />
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<MonitorCloud className="size-4 text-primary mt-1 shrink-0" />
									<div>
										<h4 className="font-semibold">
											Service Provision
										</h4>
										<p className="text-muted-foreground text-sm">
											To provide, maintain, and improve
											our platform and services
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<ScanEye className="size-4 text-primary mt-1 shrink-0" />
									<div>
										<h4 className="font-semibold">
											Content Display
										</h4>
										<p className="text-muted-foreground text-sm">
											To display your projects and profile
											information on our platform
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<EthernetPort className="size-4 text-primary mt-1 shrink-0" />
									<div>
										<h4 className="font-semibold">
											Community Features
										</h4>
										<p className="text-muted-foreground text-sm">
											To enable community interactions,
											feedback, and collaboration features
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<SmartphoneNfc className="size-4 text-primary mt-1 shrink-0" />
									<div>
										<h4 className="font-semibold">
											Communication
										</h4>
										<p className="text-muted-foreground text-sm">
											To communicate with you about
											platform updates, security notices,
											and support
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<ShieldUser className="size-4 text-primary mt-1 shrink-0" />
									<div>
										<h4 className="font-semibold">
											Security
										</h4>
										<p className="text-muted-foreground text-sm">
											To protect against fraud, abuse, and
											ensure platform security
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FingerprintPattern className="size-5 text-primary" />
								Data Protection and Security
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4 text-muted-foreground">
								<p>
									We implement appropriate technical and
									organizational measures to protect your
									personal information against unauthorized
									access, alteration, disclosure, or
									destruction.
								</p>
								<p>
									These measures include encrypted data
									transmission, secure storage systems,
									regular security audits, and restricted
									access to personal information.
								</p>
								<p>
									However, no method of transmission over the
									internet or method of electronic storage is
									100% secure. While we strive to use
									commercially acceptable means to protect
									your personal information, we cannot
									guarantee its absolute security.
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TowerControl className="size-5 text-primary" />
								Your Rights and Choices
							</CardTitle>
						</CardHeader>
						<Separator />
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<EyeClosed className="size-4 text-primary mt-1 shrink-0" />
									<div>
										<h4 className="font-semibold">
											Access and Review
										</h4>
										<p className="text-muted-foreground text-sm">
											You can access and review your
											personal information through your
											account settings
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Settings2 className="size-4 text-primary mt-1 shrink-0" />
									<div>
										<h4 className="font-semibold">
											Update and Correct
										</h4>
										<p className="text-muted-foreground text-sm">
											You can update or correct your
											personal information at any time
											through your profile
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Eraser className="size-4 text-primary mt-1 shrink-0" />
									<div>
										<h4 className="font-semibold">
											Deletion
										</h4>
										<p className="text-muted-foreground text-sm">
											You can request deletion of your
											account and associated data, subject
											to legal obligations
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<UserKey className="size-4 text-primary mt-1 shrink-0" />
									<div>
										<h4 className="font-semibold">
											Privacy Controls
										</h4>
										<p className="text-muted-foreground text-sm">
											You can control visibility of your
											projects and profile information
											through privacy settings
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Sprout className="size-5 text-primary" />
								Third-Party Services
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4 text-muted-foreground">
								<p>
									BuildHub may use third-party services for
									analytics, authentication, and other
									platform features. These services may
									collect information on our behalf and are
									subject to their own privacy policies.
								</p>
								<p>
									We use authentication services to manage
									user accounts and ensure secure access to
									our platform. Analytics services help us
									understand how our platform is used to
									improve user experience.
								</p>
								<p>
									We only share information with third parties
									that is necessary for them to provide their
									services, and we require them to protect
									your information in accordance with
									applicable privacy laws.
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<EarthLock className="size-5 text-primary" />
								Children&apos;s Privacy
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4 text-muted-foreground">
								<p>
									BuildHub is not intended for children under
									the age of 13. We do not knowingly collect
									personal information from children under 13.
									If you are a parent or guardian and believe
									your child has provided us with personal
									information, please contact us immediately.
								</p>
								<p>
									If we become aware that we have collected
									personal information from children without
									verification of parental consent, we take
									steps to remove that information from our
									servers.
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Plane className="size-5 text-primary" />
								International Data Transfers
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4 text-muted-foreground">
								<p>
									Your information may be transferred to and
									processed in countries other than your own.
									We ensure appropriate safeguards are in
									place to protect your information in
									accordance with applicable data protection
									laws.
								</p>
								<p>
									When we transfer your information
									internationally, we use standard contractual
									clauses or other legally recognized
									mechanisms to ensure adequate protection of
									your personal data.
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Megaphone className="size-5 text-primary" />
								Changes to This Privacy Policy
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4 text-muted-foreground">
								<p>
									We may update our Privacy Policy from time
									to time. We will notify you of any changes
									by posting the new Privacy Policy on this
									page and updating the &quot;Last
									Updated&quot; date.
								</p>
								<p>
									You are advised to review this Privacy
									Policy periodically for any changes. Changes
									to this Privacy Policy are effective when
									they are posted on this page.
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="md:col-span-2 lg:col-span-3">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CardSim className="size-5 text-primary" />
								Contact Us
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4 text-muted-foreground">
								<p>
									If you have any questions about this Privacy
									Policy or our data practices, please contact
									us:
								</p>
								<div className="bg-muted/30 border border-muted/30 rounded-lg p-4 space-y-2">
									<p>
										<strong>Email:</strong>{" "}
										yalok6321@gmail.com
									</p>
									<p>
										<strong>Contact Form:</strong> Use the
										contact form on our website
									</p>
									<p>
										<strong>Response Time:</strong> We
										typically respond within 5-7 business
										days
									</p>
								</div>
								<p>
									We will investigate your concerns and
									respond in accordance with applicable
									privacy laws. If you have unresolved privacy
									concerns, you may also contact relevant data
									protection authorities.
								</p>
							</div>
						</CardContent>
					</Card>

					<div className="text-start text-muted-foreground text-sm">
						<p>Last Updated: March 8, 2026</p>
					</div>
				</div>
			</div>
		</div>
	);
}
