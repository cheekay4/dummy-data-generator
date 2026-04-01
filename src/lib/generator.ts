import type { AgentCard } from './schema';

export function formToAgentCard(formData: AgentCard): Record<string, unknown> {
  const card: Record<string, unknown> = {
    name: formData.name,
    description: formData.description,
    version: formData.version,
    supportedInterfaces: formData.supportedInterfaces.map((iface) => {
      const result: Record<string, unknown> = {
        url: iface.url,
        protocolBinding: iface.protocolBinding,
        protocolVersion: iface.protocolVersion,
      };
      if (iface.tenant) result.tenant = iface.tenant;
      return result;
    }),
    capabilities: {
      ...(formData.capabilities.streaming !== null && { streaming: formData.capabilities.streaming }),
      ...(formData.capabilities.pushNotifications !== null && { pushNotifications: formData.capabilities.pushNotifications }),
      ...(formData.capabilities.extendedAgentCard !== null && { extendedAgentCard: formData.capabilities.extendedAgentCard }),
      ...(formData.capabilities.extensions && formData.capabilities.extensions.length > 0 && {
        extensions: formData.capabilities.extensions,
      }),
    },
    defaultInputModes: formData.defaultInputModes,
    defaultOutputModes: formData.defaultOutputModes,
    skills: formData.skills.map((skill) => {
      const result: Record<string, unknown> = {
        id: skill.id,
        name: skill.name,
        description: skill.description,
        tags: skill.tags,
      };
      if (skill.examples && skill.examples.length > 0) result.examples = skill.examples;
      if (skill.inputModes) result.inputModes = skill.inputModes;
      if (skill.outputModes) result.outputModes = skill.outputModes;
      return result;
    }),
  };
  if (formData.provider?.organization) card.provider = formData.provider;
  if (formData.documentationUrl) card.documentationUrl = formData.documentationUrl;
  if (formData.iconUrl) card.iconUrl = formData.iconUrl;
  return card;
}
