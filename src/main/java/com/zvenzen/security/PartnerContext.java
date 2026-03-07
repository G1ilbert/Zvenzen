package com.zvenzen.security;

import com.zvenzen.entity.Partner;
import com.zvenzen.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class PartnerContext {

    private static final String PARTNER_ATTR = "authenticatedPartner";

    public Partner getCurrentPartner() {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            throw new UnauthorizedException("No request context available");
        }
        HttpServletRequest request = attrs.getRequest();
        Partner partner = (Partner) request.getAttribute(PARTNER_ATTR);
        if (partner == null) {
            throw new UnauthorizedException("Partner not authenticated");
        }
        return partner;
    }
}
