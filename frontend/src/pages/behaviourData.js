export const groupBehaviourProfiles = (profiles = []) => {
  const groups = new Map();
  profiles.forEach((profile) => {
    const id = profile.agent_id || profile.agent_name || 'unknown';
    const entity = groups.get(id) || {
      agent_id: profile.agent_id,
      agent_name: profile.agent_name,
      agent_ip: profile.agent_ip,
      total: 0,
      normal: 0,
      unusual: 0,
      status: 'normal',
      reasons: new Set(),
      profiles: [],
      severityDeviation: false,
      ruleDeviation: false,
      decoderDeviation: false
    };
    entity.total += 1;
    if (profile.behaviour === 'unusual') {
      entity.unusual += 1;
      entity.status = 'unusual';
    } else entity.normal += 1;
    (profile.reasons || []).forEach((reason) => {
      entity.reasons.add(reason);
      const text = String(reason).toLowerCase();
      if (text.includes('severity')) entity.severityDeviation = true;
      if (text.includes('rule')) entity.ruleDeviation = true;
      if (text.includes('source') || text.includes('decoder')) entity.decoderDeviation = true;
    });
    entity.profiles.push(profile);
    groups.set(id, entity);
  });
  return Array.from(groups.values()).map((entity) => ({ ...entity, reasons: Array.from(entity.reasons) }));
};
